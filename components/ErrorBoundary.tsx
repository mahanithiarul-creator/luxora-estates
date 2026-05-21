'use client';

import React from 'react';

type ErrorBoundaryState = {
  hasError: boolean;
  message?: string;
};

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    message: undefined,
  };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : String(error),
    };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, message: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-[#02060e] text-white flex items-center justify-center px-6 py-10">
          <div className="max-w-xl rounded-[32px] border border-white/10 bg-slate-950/95 p-10 shadow-[0_30px_80px_rgba(0,0,0,0.65)]">
            <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              We encountered an unexpected issue while loading the page. Refresh or try again later.
            </p>
            <p className="mt-4 text-sm text-slate-400">{this.state.message}</p>
            <button
              type="button"
              onClick={this.resetError}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Try again
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
