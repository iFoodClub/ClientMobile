import { IDeleteImageResponse, IUploadImageResponse, UploadFolder } from "../interfaces/apiResponses";
import { RepositoryBase } from "./baseRepository";

/**
 * 📸 Repository de Upload de Imagens
 * 
 * Gerencia upload e exclusão de imagens no S3 através do backend.
 * 
 * **Pastas disponíveis:**
 * - `dishes` - Fotos de pratos dos restaurantes
 * - `users` - Fotos de perfil de usuários/funcionários
 * - `restaurants` - Fotos de perfil dos restaurantes
 * - `companies` - Logos das empresas
 * 
 * **Restrições:**
 * - Tipos aceitos: JPEG, PNG, GIF, WebP
 * - Tamanho máximo: 5MB
 */
class UploadRepository extends RepositoryBase {
  
  /**
   * Faz upload de uma imagem para o S3
   * 
   * @param file - Arquivo de imagem (pode ser um objeto File do React Native ou Web)
   * @param folder - Pasta de destino no S3
   * @param onProgress - Callback opcional para acompanhar o progresso do upload (0-100)
   * @returns Promessa com a URL e key da imagem no S3
   * 
   * @example
   * ```typescript
   * // Upload de foto de prato
   * const result = await uploadRepository.uploadImage(file, 'dishes', (progress) => {
   *   console.log(`Upload: ${progress}%`);
   * });
   * console.log('URL da imagem:', result.data.url);
   * ```
   * 
   * @example
   * ```typescript
   * // Upload de foto de perfil
   * const result = await uploadRepository.uploadImage(file, 'users');
   * // Usar result.data.url para atualizar o perfil
   * ```
   */
  async uploadImage(
    file: any,
    folder: UploadFolder,
    onProgress?: (progress: number) => void
  ) {
    const formData = new FormData();
    
    // React Native precisa de formato específico
    // Web usa File diretamente
    if (file.uri) {
      // React Native
      formData.append('file', {
        uri: file.uri,
        type: file.type || 'image/jpeg',
        name: file.name || `image-${Date.now()}.jpg`,
      } as any);
    } else {
      // Web
      formData.append('file', file);
    }

    return await this.api.post<IUploadImageResponse>(
      `/upload/image/${folder}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onProgress ? (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        } : undefined,
      }
    );
  }

  /**
   * Faz upload de foto de prato
   * 
   * @param file - Arquivo de imagem
   * @param onProgress - Callback opcional para progresso
   * @returns Promessa com a URL e key da imagem
   * 
   * @example
   * ```typescript
   * const result = await uploadRepository.uploadDishImage(file);
   * // Usar result.data.url ao criar/editar o prato
   * ```
   */
  async uploadDishImage(file: any, onProgress?: (progress: number) => void) {
    return this.uploadImage(file, 'dishes', onProgress);
  }

  /**
   * Faz upload de foto de perfil de usuário/funcionário
   * 
   * @param file - Arquivo de imagem
   * @param onProgress - Callback opcional para progresso
   * @returns Promessa com a URL e key da imagem
   * 
   * @example
   * ```typescript
   * const result = await uploadRepository.uploadUserImage(file);
   * // Usar result.data.url ao criar/editar o perfil
   * ```
   */
  async uploadUserImage(file: any, onProgress?: (progress: number) => void) {
    return this.uploadImage(file, 'users', onProgress);
  }

  /**
   * Faz upload de foto de perfil de restaurante
   * 
   * @param file - Arquivo de imagem
   * @param onProgress - Callback opcional para progresso
   * @returns Promessa com a URL e key da imagem
   * 
   * @example
   * ```typescript
   * const result = await uploadRepository.uploadRestaurantImage(file);
   * // Usar result.data.url ao criar/editar o restaurante
   * ```
   */
  async uploadRestaurantImage(file: any, onProgress?: (progress: number) => void) {
    return this.uploadImage(file, 'restaurants', onProgress);
  }

  /**
   * Faz upload de logo de empresa
   * 
   * @param file - Arquivo de imagem
   * @param onProgress - Callback opcional para progresso
   * @returns Promessa com a URL e key da imagem
   * 
   * @example
   * ```typescript
   * const result = await uploadRepository.uploadCompanyImage(file);
   * // Usar result.data.url ao criar/editar a empresa
   * ```
   */
  async uploadCompanyImage(file: any, onProgress?: (progress: number) => void) {
    return this.uploadImage(file, 'companies', onProgress);
  }

  /**
   * Deleta uma imagem do S3
   * 
   * @param key - Chave do arquivo no S3 (retornada no upload)
   * @returns Promessa com resultado da exclusão
   * 
   * @example
   * ```typescript
   * // Salvar a key quando fizer upload
   * const uploadResult = await uploadRepository.uploadDishImage(file);
   * const imageKey = uploadResult.data.key; // Ex: 'dishes/1234567890-abc.jpg'
   * 
   * // Deletar depois
   * await uploadRepository.deleteImage(imageKey);
   * ```
   */
  async deleteImage(key: string) {
    return await this.api.delete<IDeleteImageResponse>('/upload/image', {
      data: { key }
    });
  }

  /**
   * Valida se o arquivo é uma imagem válida
   * 
   * @param file - Arquivo para validar
   * @returns true se válido, false caso contrário
   * 
   * @example
   * ```typescript
   * if (uploadRepository.validateImageFile(file)) {
   *   await uploadRepository.uploadDishImage(file);
   * } else {
   *   alert('Arquivo inválido!');
   * }
   * ```
   */
  validateImageFile(file: any): { valid: boolean; error?: string } {
    // Tipos aceitos
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const fileType = file.type || file.mime;
    
    if (!fileType || !validTypes.includes(fileType)) {
      return {
        valid: false,
        error: 'Tipo de arquivo inválido. Use JPEG, PNG, GIF ou WebP',
      };
    }

    // Tamanho máximo: 5MB
    const maxSize = 5 * 1024 * 1024;
    const fileSize = file.size || file.fileSize;
    
    if (fileSize > maxSize) {
      return {
        valid: false,
        error: 'Arquivo muito grande. Máximo 5MB',
      };
    }

    return { valid: true };
  }

  /**
   * Extrai a key de uma URL do S3
   * Útil quando você tem apenas a URL e precisa deletar a imagem
   * 
   * @param url - URL completa da imagem no S3
   * @returns Key do arquivo ou null se inválida
   * 
   * @example
   * ```typescript
   * const url = 'https://foodclub-uploads.s3.us-east-1.amazonaws.com/dishes/123-abc.jpg';
   * const key = uploadRepository.extractKeyFromUrl(url);
   * // key = 'dishes/123-abc.jpg'
   * 
   * await uploadRepository.deleteImage(key);
   * ```
   */
  extractKeyFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      // Remove a primeira barra
      return urlObj.pathname.substring(1);
    } catch {
      return null;
    }
  }
}

export default new UploadRepository();

