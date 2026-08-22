import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Graceful silent recovery logging
    if (process.env.NODE_ENV !== "production") {
      console.warn("Recovered component error:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#121212] text-white">
          <div className="max-w-md w-full p-6 rounded-3xl bg-[#202124] border border-[#3c4043] text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-[#EA4335]/20 text-[#f28b82] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-lg font-bold">RECOVER-X Safe Recovery</h3>
            <p className="text-xs text-[#9aa0a6]">
              An unexpected interface anomaly was intercepted. The session state remains secure.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 rounded-full bg-[#1a73e8] text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 mx-auto hover:bg-[#1557b0] transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
