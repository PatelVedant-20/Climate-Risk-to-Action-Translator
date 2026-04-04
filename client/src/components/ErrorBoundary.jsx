import { Component } from 'react';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--bg-primary, #071a0e)',
                    color: 'var(--text-primary, #ecfdf5)',
                    fontFamily: 'var(--font-body, Inter, sans-serif)',
                    padding: '2rem'
                }}>
                    <div style={{
                        textAlign: 'center',
                        maxWidth: '480px',
                        background: 'rgba(255,255,255,0.04)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '24px',
                        padding: '3rem 2rem',
                        boxShadow: '0 8px 40px rgba(0,0,0,0.5)'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌿</div>
                        <h2 style={{
                            fontFamily: 'var(--font-heading, Outfit, sans-serif)',
                            fontSize: '1.5rem',
                            marginBottom: '0.75rem'
                        }}>
                            Something went wrong
                        </h2>
                        <p style={{
                            color: 'var(--text-muted, #6b9080)',
                            fontSize: '0.9rem',
                            lineHeight: '1.6',
                            marginBottom: '1.5rem'
                        }}>
                            An unexpected error occurred. Please try again.
                        </p>
                        <button
                            onClick={this.handleRetry}
                            style={{
                                padding: '0.75rem 2rem',
                                fontSize: '1rem',
                                fontWeight: '700',
                                color: '#071a0e',
                                background: 'linear-gradient(135deg, #4ade80, #34d399)',
                                border: 'none',
                                borderRadius: '24px',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                boxShadow: '0 4px 20px rgba(74,222,128,0.25)'
                            }}
                            onMouseEnter={e => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 8px 30px rgba(74,222,128,0.35)';
                            }}
                            onMouseLeave={e => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 20px rgba(74,222,128,0.25)';
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
