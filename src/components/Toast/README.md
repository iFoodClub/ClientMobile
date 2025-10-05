#  Sistema de Toast

Sistema de notificações toast moderno para React Native.

## 🚀 Instalação

Envolva sua aplicação com o `ToastProvider`:

```tsx
// app/_layout.tsx
import { ToastProvider } from '@/src/components/Toast';

export default function RootLayout() {
  return (
    <ToastProvider>
      {/* Sua aplicação */}
    </ToastProvider>
  );
}
```

##  Como Usar

### Hooks Específicos (Recomendado)
```tsx
import { useToastSuccess, useToastError, useToastWarning, useToastInfo } from '@/src/components/Toast';

function MyComponent() {
  const { showSuccess } = useToastSuccess();
  const { showError } = useToastError();

  const handleLogin = async () => {
    try {
      await login();
      showSuccess('Login realizado!');
    } catch (error) {
      showError('Erro no login.');
    }
  };
}
```

### Hook com Todos os Tipos
```tsx
import { useToastAll } from '@/src/components/Toast';

function MyComponent() {
  const { showSuccess, showError, showWarning, showInfo } = useToastAll();

  return (
    <View>
      <Button title="Sucesso" onPress={() => showSuccess('Operação realizada!')} />
      <Button title="Erro" onPress={() => showError('Algo deu errado!')} />
    </View>
  );
}
```

##  Tipos Disponíveis

| Tipo | Cor | Uso |
|------|-----|-----|
| `success` | 🟢 Verde | Operações bem-sucedidas |
| `error` | 🔴 Vermelho | Erros e falhas |
| `warning` | 🟡 Amarelo | Avisos e alertas |
| `info` | 🔵 Azul | Informações gerais |

##  Características

- Design moderno com transparência
- Tamanho compacto (200px - 300px)
- Auto-remoção após 3 segundos
- Clicável para remoção manual
- Posicionamento no topo centralizado
- TypeScript completo