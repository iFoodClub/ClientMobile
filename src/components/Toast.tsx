import React, { createContext, useContext, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

const ToastContext = createContext<{
  showToast: (
    message: string,
    type: "success" | "error" | "warning" | "info"
  ) => void;
} | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (
    message: string,
    type: "success" | "error" | "warning" | "info"
  ) => {
    const id = Date.now().toString();
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    // Remove após 3 segundos
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getColor = (type: string) => {
    switch (type) {
      case "success":
        return "rgba(16, 185, 129, 0.9)"; // Verde com transparência
      case "error":
        return "rgba(239, 68, 68, 0.9)"; // Vermelho com transparência
      case "warning":
        return "rgba(245, 158, 11, 0.9)"; // Amarelo com transparência
      case "info":
        return "rgba(59, 130, 246, 0.9)"; // Azul com transparência
      default:
        return "rgba(59, 130, 246, 0.9)";
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <View style={styles.container}>
        {toasts.map((toast) => (
          <TouchableOpacity
            key={toast.id}
            style={[styles.toast, { backgroundColor: getColor(toast.type) }]}
            onPress={() => removeToast(toast.id)}
          >
            <Text style={styles.text}>{toast.message}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast deve ser usado dentro de ToastProvider");
  }
  return context;
};

// Hooks específicos para facilitar o uso
export const useToastSuccess = () => {
  const { showToast } = useToast();
  return {
    showSuccess: (message: string) => showToast(message, "success"),
  };
};

export const useToastError = () => {
  const { showToast } = useToast();
  return {
    showError: (message: string) => showToast(message, "error"),
  };
};

export const useToastWarning = () => {
  const { showToast } = useToast();
  return {
    showWarning: (message: string) => showToast(message, "warning"),
  };
};

export const useToastInfo = () => {
  const { showToast } = useToast();
  return {
    showInfo: (message: string) => showToast(message, "info"),
  };
};

// Hook genérico com todos os tipos
export const useToastAll = () => {
  const { showToast } = useToast();
  return {
    showSuccess: (message: string) => showToast(message, "success"),
    showError: (message: string) => showToast(message, "error"),
    showWarning: (message: string) => showToast(message, "warning"),
    showInfo: (message: string) => showToast(message, "info"),
    showToast: (
      message: string,
      type: "success" | "error" | "warning" | "info"
    ) => showToast(message, type),
  };
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 32,
    right: 32,
    zIndex: 9999,
  },
  toast: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    alignSelf: "center",
    maxWidth: 300, // Largura máxima menor
    minWidth: 200, // Largura mínima
  },
  text: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 18,
  },
});
