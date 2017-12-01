import os
import uuid

import datetime
from flask import Flask, request, redirect, url_for, flash, jsonify
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = os.path.join(
    os.path.dirname(
        os.path.realpath(__file__)), 'replays')
ALLOWED_EXTENSIONS = {'bin'}
UPLOAD_RATE_LIMIT_MINUTES = 4.5
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 512 * 1024 * 1024

last_upload = {}
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            return jsonify({'status': 'No file uploaded'})
        file = request.files['file']
        # if user does not select file, browser also
        # submit a empty part without filename
        if file.filename == '':
            return jsonify({'status': 'No selected file'})
        if request.remote_addr not in last_upload:
            last_upload[request.remote_addr] = datetime.datetime.now() - datetime.timedelta(minutes=15)
        time_difference = datetime.datetime.now() - last_upload[request.remote_addr]
        min_last_upload = (time_difference.total_seconds() / 60.0)
        if file and allowed_file(file.filename) and min_last_upload > UPLOAD_RATE_LIMIT_MINUTES:
            filename = str(request.remote_addr) + '_' + str(uuid.uuid4()) + '.bin'
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            last_upload[request.remote_addr] = datetime.datetime.now()
            return jsonify({'status': 'Success'})
        elif min_last_upload < UPLOAD_RATE_LIMIT_MINUTES:
            return jsonify({'status': 'Try again later', 'seconds': 60 * (UPLOAD_RATE_LIMIT_MINUTES - min_last_upload)})
        elif not allowed_file(file.filename):
            return jsonify({'status': 'Not an allowed file'})
    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
      <p><input type=file name=file>
         <input type=submit value=Upload>
    </form>
    '''


if __name__ == '__main__':
    app.run()
