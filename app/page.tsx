import ImageUploader from './components/ImageUploader';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Limpador de Assinatura
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Remova o fundo das suas assinaturas feitas à mão
          </p>
        </div>
        <ImageUploader />
      </main>
    </div>
  );
}
