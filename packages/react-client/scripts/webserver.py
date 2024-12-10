import http.server
import socketserver

Handler = http.server.SimpleHTTPRequestHandler

def do_GET(self):
        print(self.path)
        self.send_response(301)
        new_path = '%s%s'%('http://localhost:6719/', self.path)
        self.send_header('Location', new_path)
        self.end_headers()

Handler.do_GET = do_GET

socketserver.TCPServer(("", 3000), Handler).serve_forever()
