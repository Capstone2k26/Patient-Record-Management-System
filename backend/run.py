from app import create_app
from dotenv import load_dotenv
import os

load_dotenv()

app = create_app()

if __name__ == '__main__':
    host = os.getenv('FLASK_HOST', '0.0.0.0')
    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    print(f"\n{'='*60}")
    print(f"🏥 PRMS Backend Server Starting...")
    print(f"{'='*60}")
    print(f"📍 Server: http://{host}:{port}")
    print(f"🔗 Health Check: http://{host}:{port}/api/health")
    print(f"🔐 Auth Endpoint: http://{host}:{port}/api/auth/login")
    print(f"{'='*60}\n")
    
    app.run(host=host, port=port, debug=debug)
