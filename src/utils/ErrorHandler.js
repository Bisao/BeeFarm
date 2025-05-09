
export class ErrorHandler {
    static handleError(error, context) {
        console.error(`Error in ${context}:`, error.message || error);
        
        if (error instanceof TypeError) {
            return 'Ocorreu um erro ao processar os dados';
        } else if (error instanceof ReferenceError) {
            return 'Erro interno do sistema';
        }
        
        return 'Ocorreu um erro inesperado';
    }

    static validateInput(value, type, range = null) {
        if (type === 'number') {
            const num = Number(value);
            if (isNaN(num)) return false;
            if (range && (num < range.min || num > range.max)) return false;
        }
        return true;
    }
}
