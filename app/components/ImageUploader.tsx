'use client';

import { useState, useRef } from 'react';

export default function ImageUploader() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setProcessedImageUrl(null);
      setError(null);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setProcessedImageUrl(null);
      setError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemoveBackground = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setError(null);
    setProcessedImageUrl(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      if (webhookUrl.trim()) {
        formData.append('webhookUrl', webhookUrl.trim());
      }

      const response = await fetch('/api/remove-background', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Falha ao processar imagem' }));
        throw new Error(errorData.error || 'Falha ao processar imagem');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setProcessedImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (processedImageUrl) {
      const a = document.createElement('a');
      a.href = processedImageUrl;
      a.download = 'signature-cleaned.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setProcessedImageUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
      {/* Upload Section */}
      {!selectedImage && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            Clique para enviar ou arraste e solte
          </p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            PNG, JPG, GIF até 10MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageSelect}
          />
        </div>
      )}

      {/* Preview and Process Section */}
      {selectedImage && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Image */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Original
              </h3>
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Assinatura original"
                    className="w-full h-64 object-contain"
                  />
                )}
              </div>
            </div>

            {/* Processed Image */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Processada
              </h3>
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700 bg-[linear-gradient(45deg,#e5e7eb_25%,transparent_25%,transparent_75%,#e5e7eb_75%,#e5e7eb),linear-gradient(45deg,#e5e7eb_25%,transparent_25%,transparent_75%,#e5e7eb_75%,#e5e7eb)] bg-[length:20px_20px] bg-[position:0_0,10px_10px] dark:bg-[linear-gradient(45deg,#374151_25%,transparent_25%,transparent_75%,#374151_75%,#374151),linear-gradient(45deg,#374151_25%,transparent_25%,transparent_75%,#374151_75%,#374151)]">
                {processedImageUrl ? (
                  <img
                    src={processedImageUrl}
                    alt="Assinatura processada"
                    className="w-full h-64 object-contain"
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center text-gray-400 dark:text-gray-500">
                    {isProcessing ? 'Processando...' : 'Nenhuma imagem processada ainda'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Webhook URL Input */}
          <div>
            <label htmlFor="webhookUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL do Webhook (opcional)
            </label>
            <input
              id="webhookUrl"
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://example.com/webhook"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              disabled={isProcessing}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              A imagem processada será enviada para esta URL via requisição POST
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleRemoveBackground}
              disabled={isProcessing}
              className="flex-1 min-w-[200px] bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processando...' : 'Remover Fundo'}
            </button>
            
            {processedImageUrl && (
              <button
                onClick={handleDownload}
                className="flex-1 min-w-[200px] bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Baixar Imagem
              </button>
            )}
            
            <button
              onClick={handleReset}
              disabled={isProcessing}
              className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              Redefinir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
