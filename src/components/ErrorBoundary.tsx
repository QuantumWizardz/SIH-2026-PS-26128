import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Button } from '../design/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    // Basic reset
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (import.meta.env.DEV) {
        return (
          <div className="p-8 space-y-4 bg-cream-deep/30 rounded-soft border border-espresso/10">
            <h2 className="text-2xl font-bold text-risk-oxblood">Something went wrong</h2>
            <div className="bg-white p-4 rounded overflow-auto border border-espresso/10">
              <p className="font-mono text-sm text-espresso mb-4">{this.state.error && this.state.error.toString()}</p>
              <pre className="font-mono text-xs text-espresso-70 whitespace-pre-wrap">
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>
            <Button onClick={this.handleReset} variant="primary">Reset Demo Data</Button>
          </div>
        );
      }

      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center space-y-6 bg-cream p-12 rounded-soft border border-espresso/10">
            <h2 className="text-3xl font-extrabold tracking-tight text-espresso">Something went wrong on this screen</h2>
            <p className="text-espresso-70 text-lg">We've logged the error and are looking into it.</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => window.history.back()} variant="secondary">Go Back</Button>
              <Button onClick={this.handleReset} variant="primary">Reset Demo Data</Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
