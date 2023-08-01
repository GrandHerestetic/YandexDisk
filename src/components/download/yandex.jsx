import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

const YandexDiskUploader = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [progressMap, setProgressMap] = useState({});

  // Функция загрузки файла на Яндекс.Диск
  const uploadFileToYandexDisk = async (file) => {
    try {
      // Здесь подставьте ваш токен доступа к API Яндекс.Диска
      const token = '682ea37752a348df883323d11d249847';
      const url = `https://cloud-api.yandex.net/v1/disk/resources/upload?path=/${file.name}&overwrite=true`;
      const response = await axios.get(url, {
        headers: { Authorization: `OAuth y0_AgAAAABjT-R_AApEqgAAAADpG-3MtK-3GWZzQ7aG0YlVYzPK79Kwrx4` },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgressMap((prevProgressMap) => ({ ...prevProgressMap, [file.name]: percentCompleted }));
        },
      });

      const uploadLink = response.data.href;
      await axios.put(uploadLink, file);

      // Если загрузка прошла успешно, добавляем файл в список загруженных
      setUploadedFiles((prevFiles) => [...prevFiles, file.name]);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  // Используем react-dropzone для создания области выбора файлов
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: (acceptedFiles) => {
      const selectedFiles = acceptedFiles.slice(0, 100);
      selectedFiles.forEach((file) => {
        uploadFileToYandexDisk(file);
      });
    },
    maxFiles: 100, // Allow selecting up to 100 files
  });

  return (
    <div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>
          {isDragActive
            ? 'Перетащите файлы сюда'
            : 'Перетащите файлы сюда или кликните, чтобы выбрать файлы'}
        </p>
        {isDragReject && <p>Некоторые файлы не могут быть загружены</p>}
      </div>
      {uploadedFiles.length > 0 && (
        <div>
          <h4>Загруженные файлы:</h4>
          <ul>
            {uploadedFiles.map((file) => (
              <li key={file}>{file}</li>
            ))}
          </ul>
        </div>
      )}
      {Object.keys(progressMap).length > 0 && (
        <div>
          <h4>Прогресс загрузки:</h4>
          <ul>
            {Object.entries(progressMap).map(([filename, progress]) => (
              <li key={filename}>
                {filename}: {progress}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default YandexDiskUploader;
