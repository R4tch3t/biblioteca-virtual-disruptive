const ErrorIcon = () => {
    return (
        <div className="absolute right-0 mt-4" style={{right: -5}} >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24">
                <path d="M0 8.48934C0 13.1776 3.90202 16.9787 8.71473 16.9787C13.5274 16.9787 17.4295 13.1776 17.4295 8.48934C17.4295 3.8011 13.5274 0 8.71473 0C3.90202 0 0 3.8011 0 8.48934Z" fill="#f44336" fill-rule="nonzero" opacity="1" stroke="none"/>
                <path d="M6.2502 4.88816L5.01794 6.08855L11.1793 12.0905L12.4115 10.8901L6.2502 4.88816Z" fill="#ffffff" fill-rule="nonzero" opacity="1" stroke="none"/>
                <path d="M5.01794 10.8901L6.2502 12.0905L12.4115 6.08855L11.1793 4.88816L5.01794 10.8901Z" fill="#ffffff" fill-rule="nonzero" opacity="1" stroke="none" />
            </svg>
        </div>
    )
}

export default ErrorIcon