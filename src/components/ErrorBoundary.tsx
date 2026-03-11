import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-umbra-bg flex items-center justify-center p-6">
          <div className="max-w-md w-full p-8 rounded-3xl bg-umbra-card border border-red-500/30 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-red-500 text-2xl font-bold">!</span>
            </div>
            <h2 className="text-2xl font-bold mb-4">Algo deu errado</h2>
            <p className="text-umbra-muted mb-8">
              Ocorreu um erro inesperado. Por favor, recarregue a página ou tente novamente mais tarde.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors"
            >
              Recarregar Página
            </button>
            {(import.meta as any).env?.DEV && (
              <pre className="mt-6 p-4 bg-black rounded-lg text-left text-xs text-red-400 overflow-auto max-h-40">
                {this.state.error?.message}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
