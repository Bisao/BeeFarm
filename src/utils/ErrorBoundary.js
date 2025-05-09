
export class ErrorBoundary {
    static handleError(error, context, fallback) {
        console.error(`Error in ${context}:`, error);
        
        // Log error to analytics/monitoring service
        this.logError(error, context);
        
        // Return fallback value/state
        return fallback;
    }

    static logError(error, context) {
        // Implement error logging/monitoring
        const errorData = {
            message: error.message,
            stack: error.stack,
            context,
            timestamp: new Date().toISOString()
        };
        
        // Store error data (localStorage for now, can be replaced with proper logging service)
        const errors = JSON.parse(localStorage.getItem('game_errors') || '[]');
        errors.push(errorData);
        localStorage.setItem('game_errors', JSON.stringify(errors));
    }
}
