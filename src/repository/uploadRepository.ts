import { RepositoryBase } from "./baseRepository";

class UploadRepository extends RepositoryBase {
  /**
   * Envia uma imagem nativa selecionada do dispositivo para o backend via multipart/form-data.
   * @param uri - URI local do arquivo (gerada pelo expo-image-picker)
   * @param folder - Pasta de destino lógica no Blob Storage ('pratos', 'perfis', 'funcionarios')
   */
  async uploadImage(uri: string, folder: "pratos" | "perfis" | "funcionarios") {
    const filename = uri.split("/").pop() || "upload.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    const formData = new FormData();
    
    // No React Native/Expo, arquivos no FormData são passados como objetos literais com uri, name e type.
    formData.append("file", {
      uri,
      name: filename,
      type,
    } as any);

    return await this.api.post(`/upload/image/${folder}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export default new UploadRepository();
