import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Upload, CheckCircle, AlertCircle, Video } from "lucide-react";

interface UploadResponse {
  success: boolean;
  message: string;
  videoUrl?: string;
  originalName?: string;
  size?: number;
}

export default function VideoUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      setUploadResult(null);
    } else {
      setUploadResult({
        success: false,
        message: 'Por favor, selecione um arquivo de vídeo válido.'
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadVideo = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    const formData = new FormData();
    formData.append('video', selectedFile);

    try {
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response: UploadResponse = JSON.parse(xhr.responseText);
          setUploadResult(response);
        } else {
          const errorResponse = JSON.parse(xhr.responseText);
          setUploadResult({
            success: false,
            message: errorResponse.error || 'Erro ao fazer upload do vídeo'
          });
        }
        setUploading(false);
      });

      xhr.addEventListener('error', () => {
        setUploadResult({
          success: false,
          message: 'Erro de rede ao fazer upload do vídeo'
        });
        setUploading(false);
      });

      xhr.open('POST', '/api/upload/video');
      xhr.send(formData);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadResult({
        success: false,
        message: 'Erro inesperado ao fazer upload'
      });
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-6 w-6" />
              Upload de Vídeos
            </CardTitle>
            <CardDescription>
              Faça upload de vídeos para suas aulas. Formatos aceitos: MP4, WebM, OGG, MOV, AVI (máximo 100MB).
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Drag and Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Arraste e solte seu vídeo aqui
              </p>
              <p className="text-gray-500 mb-4">ou</p>
              <Label htmlFor="video-input">
                <Button variant="outline" className="cursor-pointer" type="button">
                  Selecionar arquivo
                </Button>
                <Input
                  id="video-input"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />
              </Label>
            </div>

            {/* Selected File Info */}
            {selectedFile && (
              <Card className="bg-gray-50">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Video className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    </div>
                    {!uploading && (
                      <Button onClick={uploadVideo} className="ml-4">
                        <Upload className="h-4 w-4 mr-2" />
                        Enviar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Enviando...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            {/* Upload Result */}
            {uploadResult && (
              <Alert className={uploadResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                {uploadResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={uploadResult.success ? 'text-green-800' : 'text-red-800'}>
                  {uploadResult.message}
                  {uploadResult.success && uploadResult.videoUrl && (
                    <div className="mt-2">
                      <p className="text-sm">
                        <strong>URL do vídeo:</strong> {uploadResult.videoUrl}
                      </p>
                      {uploadResult.size && (
                        <p className="text-sm">
                          <strong>Tamanho:</strong> {formatFileSize(uploadResult.size)}
                        </p>
                      )}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
            
            {/* Help Text */}
            <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Dicas para upload de vídeos:</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Tamanho máximo: 100MB por arquivo</li>
                <li>Formatos aceitos: MP4, WebM, OGG, MOV, AVI</li>
                <li>Resolução recomendada: 1280x720 (HD) ou superior</li>
                <li>Use uma boa conexão de internet para uploads mais rápidos</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
