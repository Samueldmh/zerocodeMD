import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
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
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || "An unexpected error occurred.";

      return (
        <div className="min-h-screen bg-quizard-bg flex items-center justify-center p-4 font-sans text-white">
          <div className="max-w-md w-full bg-quizard-card border border-rose-500/20 rounded-[2rem] p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-rose-500" />
            </div>
            <h2 className="text-2xl font-black text-white mb-4 tracking-tight">Something went wrong</h2>
            <p className="text-white/60 mb-8 text-sm leading-relaxed font-medium">
              {errorMessage}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-white/5 text-white rounded-xl font-black text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2 border border-white/10 uppercase tracking-widest"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
