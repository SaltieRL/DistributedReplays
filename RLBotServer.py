import datetime
import glob
import hashlib
import os
import uuid
import pandas as pd
from flask import Flask, request, jsonify, send_file, render_template
UPLOAD_FOLDER = os.path.join(
    os.path.dirname(
        os.path.realpath(__file__)), 'replays')
ALLOWED_EXTENSIONS = {'bin', 'gz'}
UPLOAD_RATE_LIMIT_MINUTES = 4.5
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 512 * 1024 * 1024

if not os.path.isdir('replays/'):
    os.mkdir('replays/')
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
        if file and allowed_file(file.filename):  # and min_last_upload > UPLOAD_RATE_LIMIT_MINUTES:
            # h = hashlib.sha1()
            # for b in iter(lambda: file.stream.read(128 * 1024), b''):
            #     h.update(b)
            # h.hexdigest()
            filename = str(request.remote_addr) + '_' + str(uuid.uuid4()) + '.gz'
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            last_upload[request.remote_addr] = datetime.datetime.now()
            return jsonify({'status': 'Success'})
        elif min_last_upload < UPLOAD_RATE_LIMIT_MINUTES:
            return jsonify({'status': 'Try again later', 'seconds': 60 * (UPLOAD_RATE_LIMIT_MINUTES - min_last_upload)})
        elif not allowed_file(file.filename):
            return jsonify({'status': 'Not an allowed file'})

    fs = glob.glob(os.path.join('replays', '*'))
    df = pd.DataFrame(fs, columns=['FILENAME'])
    df['IP_PREFIX'] = df['FILENAME'].apply(lambda x: ".".join(x.split('\\')[-1].split('/')[-1].split('.')[0:2]))

    return render_template('index.html', stats=df.groupby(by='IP_PREFIX').count().sort_values(by='FILENAME', ascending=False).reset_index().as_matrix())


@app.route('/replays/list')
def list_replays():
    if request.method == 'GET':
        fs = os.listdir('replays/')
        return jsonify([f.split('_')[-1] for f in fs])
    return ''


@app.route('/replays/<name>')
def get_replay(name):
    if request.method == 'GET':
        fs = os.listdir('replays/')
        filename = [f for f in fs if name in f][0]
        return send_file('replays/' + filename, as_attachment=True, attachment_filename=filename.split('_')[-1])


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
