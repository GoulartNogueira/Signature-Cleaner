import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const webhookUrl = formData.get('webhookUrl') as string | null;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'Nenhum arquivo de imagem fornecido' },
        { status: 400 }
      );
    }

    const apiKey = process.env.PHOTOROOM_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Chave da API Photoroom não configurada' },
        { status: 500 }
      );
    }

    // Create FormData for Photoroom API
    const photoroomFormData = new FormData();
    photoroomFormData.append('image_file', imageFile);

    // Call Photoroom API to remove background
    const response = await fetch('https://sdk.photoroom.com/v1/segment', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
      },
      body: photoroomFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Photoroom API error:', errorText);
      return NextResponse.json(
        { error: 'Falha ao processar imagem com a API Photoroom' },
        { status: response.status }
      );
    }

    // Get the processed image as blob
    const processedImageBlob = await response.blob();
    const processedImageBuffer = await processedImageBlob.arrayBuffer();

    // Send to webhook if URL provided
    if (webhookUrl) {
      try {
        const webhookFormData = new FormData();
        webhookFormData.append('image', new Blob([processedImageBuffer], { type: 'image/png' }), 'signature.png');
        
        await fetch(webhookUrl, {
          method: 'POST',
          body: webhookFormData,
        });
      } catch (webhookError) {
        console.error('Webhook error:', webhookError);
        // Don't fail the request if webhook fails
      }
    }

    // Return the processed image
    return new NextResponse(processedImageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="signature-cleaned.png"',
      },
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
