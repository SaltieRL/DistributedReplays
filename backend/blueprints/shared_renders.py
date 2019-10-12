from flask import render_template


def render_with_session(template, session, **kwargs):
    """
    Render a template with session objects. Required if there are objs from objects.py being used in the template. Closes session after rendering.

    :param template: template to render
    :param session: session to use (and close afterwards)
    :param kwargs: extra arguments to be passed to render_template
    :return: response object
    """
    response = render_template(template, **kwargs)
    session.close()
    return response
