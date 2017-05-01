import fs from 'fs';
import AWS from 'aws-sdk';

import Uploader from 's3-uploader';
import tmp from 'tmp';

const awsKey = process.env.AWS_ACCESS_KEY;
const awsSecret = process.env.AWS_ACCESS_SECRET;
const region = 'us-west-2';
const uploadFolder = 'pass-my-exam-documents';
const fileUrl = process.env.S3DOC_URL;
const moment = require('moment');

export const client = new Uploader(uploadFolder, {
  aws: {
    path: 'images/',
    region: region,
    acl: 'public-read',
    accessKeyId: awsKey,
    secretAccessKey: awsSecret
  },
  cleanup: {
    versions: true,
    original: false
  },
  original: {
    awsImageAcl: 'public-read'
  },
  versions: [
    {
      maxHeight: 1040,
      maxWidth: 1040,
      format: 'jpg',
      suffix: '-large'
    },
    {
      maxHeight: 150,
      maxWidth: 150,
      format: 'jpg',
      suffix: '-thumb'
    },
    {
      maxHeight: 600,
      maxWidth: 600,
      format: 'jpg',
      suffix: '-medium'
    }
  ]
});

var s3 = new AWS.S3({
  accessKeyId:awsKey,
  secretAccessKey:awsSecret,
  region: region
});

function getName() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + '-' + moment().format('YYYYMMDDHHmmss');
}

// file = 'some/image.jpg'
export default function photoUploader(payload, cb) {
  let type;
  switch (true) {
    case payload.type == 'data:image/jpeg;base64':
    case payload.type == 'data:image/jpg;base64':
      type = 'jpg';
      break;
    case payload.type == 'data:image/png;base64':
      type = 'png';
      break;
    case payload.type == 'data:application/msword;base64':
      type = 'doc';
      break;
    case payload.type == 'data:application/vnd.ms-excel;base64':
      type = 'xls';
      break;
    case payload.type == 'data:application/pdf;base64':
      type = 'pdf';
      break;
    case payload.type == 'data:text/csv;base64':
      type = 'csv';
      break;
    default:
      type = 'txt';
      break;

  }
  const image = payload.data;
  let file = tmp.tmpNameSync({ postfix: `.${type}` });

  if (['data:image/png;base64','data:image/jpeg;base64','data:image/jpg;base64'].indexOf(payload.type) == -1) {
    const fileName = getName() + '.' + type;
    s3.putObject({
      Bucket: fileUrl,
      Key: fileName,
      Body: new Buffer(image, 'base64'),
      ACL: 'public-read'
    },function (err, data) {
      if (err) {
        cb({ err });
      } else {
        cb({
          versions: [
            {
              suffix: '-large',
              url: 'https://s3-us-west-2.amazonaws.com/' + fileUrl + '/' + fileName,
            },                    {
              suffix: '-medium',
              url: 'https://s3-us-west-2.amazonaws.com/' + fileUrl + '/' + fileName,
            },
            {
              suffix: '-thumb',
              url: 'https://s3-us-west-2.amazonaws.com/' + fileUrl + '/' + fileName,
            },
            {
              url: 'https://s3-us-west-2.amazonaws.com/' + fileUrl + '/' + fileName,
            }
          ]
        });
      }
    });

  } else {
    fs.writeFileSync(file, image, 'base64');
    client.upload(file, {}, (err, versions, meta) => {
      //console.log('versions',versions);
      if (err) {
        // console.log('err from photoUploader', err);
        cb({ err });
      } else {
        // console.log('success from photoUploader', versions);

        cb({ versions });
      }
    });
  }
}