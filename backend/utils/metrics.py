"""
The MIT License (MIT)

Copyright (c) 2016 Vitaly R. Samigullin

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
"""
import time

import math
from prometheus_client import Counter, Histogram, Info

#
# Metrics registration
#
from backend.blueprints.spa_api.errors.errors import CalculatedError
from backend.utils.safe_flask_globals import get_request

METRICS_REQUEST_LATENCY = Histogram(
    "app_request_latency_seconds", "Application Request Latency", ["method", "endpoint"]
)

METRICS_TRAINING_PACK_CREATION_TIME = Histogram(
    "app_training_pack_creation_seconds", "Training Pack Creation Time"
)

METRICS_KEYED_REQUEST_ERRORS = Counter(
    "exceptions_with_user_info",
    "Internal Exceptions With User Info",
    ["method", "full_endpoint", "endpoint", "exception_type"]
)

METRICS_REQUEST_ERRORS = Counter(
    "exceptions", "Internal Exceptions", ["method", "endpoint", "exception_type"]
)

METRICS_REQUEST_COUNT = Counter(
    "app_request_count",
    "Application Request Count",
    ["method", "endpoint", "http_status"],
)


METRICS_SAVED_REPLAY_COUNT = Counter(
    "app_saved_replay_count",
    "Saved replay count",
)

METRICS_INFO = Info("app_version", "Application Version")


def add_saved_replay():
    METRICS_SAVED_REPLAY_COUNT.inc()


#
# Request callbacks
#
def create_clean_request_path() -> str:
    request = get_request()
    try:
        if request.view_args is None or len(request.view_args) <= 0:
            return request.path
        cleaned_path = request.path
        args = request.view_args
        for key, value in args.items():
            cleaned_path = cleaned_path.replace(value, key)
        return cleaned_path
    except:
        return request.path


class MetricsHandler:
    @staticmethod
    def log_exception_for_metrics(exception: CalculatedError):
        """
        Logs that an exception internally occurred and was caught by the handler
        :param exception: The exception that occurred
        """
        request = get_request()
        cleaned_path = create_clean_request_path()
        METRICS_REQUEST_ERRORS.labels(request.method, cleaned_path, type(exception).__name__).inc()
        # We do not have a need for this and it takes more space than other metrics
        # METRICS_KEYED_REQUEST_ERRORS.labels(request.method, request.path, cleaned_path, type(exception).__name__).inc()

    @staticmethod
    def before_request():
        """
        Get start time of a request
        """
        request = get_request()
        request._prometheus_metrics_request_start_time = time.time()

    @staticmethod
    def after_request(response):
        """
        Register Prometheus metrics after each request
        """
        clean_path = create_clean_request_path()
        request = get_request()

        # Count number of times request is called
        METRICS_REQUEST_COUNT.labels(
            request.method, clean_path, response.status_code
        ).inc()

        # Count latency of request
        request_latency = time.time() - request._prometheus_metrics_request_start_time
        if not math.isinf(request_latency) and not math.isnan(request_latency):
            METRICS_REQUEST_LATENCY.labels(request.method, clean_path).observe(
                request_latency
            )
        else:
            print(request_latency)
        return response

    @staticmethod
    def setup_metrics_callbacks(app, app_version=None):
        """
        Register metrics middlewares

        Use in your application factory (i.e. create_app):
        register_middlewares(app, settings["version"], settings["config"])

        Flask application can register more than one before_request/after_request.
        Beware! Before/after request callback stored internally in a dictionary.
        Before CPython 3.6 dictionaries didn't guarantee keys order, so callbacks
        could be executed in arbitrary order.
        """
        app.before_request(MetricsHandler.before_request)
        app.after_request(MetricsHandler.after_request)
        METRICS_INFO.info({"version": app_version})
