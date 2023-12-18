const multer = require('multer');
const B2  = require('backblaze-b2');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const b2 = new B2({
  applicationKeyId: '005ab89d6ba54620000000001',
  applicationKey: 'K0051MW+8V/9svul4I88jEN2rlOZdrs',
  bucketId: 'serverPdv',
});

b2.authorize().then(() => {
  console.log('Autenticado com sucesso no Backblaze');
}).catch((error) => {
  console.error('Erro ao autenticar no Backblaze:', error);
});

const uploadToBackblaze = async (data, fileName) => {
  const fileBuffer = Buffer.from(data, 'binary');

  try {
    const response = await b2.uploadFile({
      data: fileBuffer,
      fileName: fileName,
      bucketId: 'serverPdv'
    });

    return response;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao fazer o upload para o Backblaze');
  }
};

module.exports = { upload, uploadToBackblaze };