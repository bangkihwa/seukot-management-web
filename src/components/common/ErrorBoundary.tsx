import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-page flex items-center justify-center p-4">
          <div className="glass-card-solid max-w-lg w-full p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center">
              <span className="text-red-500 text-xl font-bold">!</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-4">오류가 발생했습니다</h2>
            <pre className="bg-red-50/80 border border-red-200 rounded-xl p-4 text-left text-sm text-red-700 whitespace-pre-wrap mb-6 max-h-40 overflow-auto">
              {this.state.error?.message}
            </pre>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.href = '/admin'
              }}
              className="btn-primary-admin"
            >
              관리자 페이지로 돌아가기
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
