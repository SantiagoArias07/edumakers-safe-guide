import { Component } from 'react'
import { AlertCircle } from 'lucide-react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <div
            role="alert"
            className="flex flex-col items-center justify-center gap-3 p-8 text-center"
          >
            <AlertCircle size={32} className="text-red-500" aria-hidden="true" />
            <p className="text-sm text-gray-600 dark:text-white/60">
              Algo salió mal. Por favor recarga la página.
            </p>
            <button
              onClick={() => this.setState({ error: null })}
              className="btn-secondary text-xs px-4 py-2"
            >
              Intentar de nuevo
            </button>
          </div>
        )
      )
    }
    return this.props.children
  }
}
