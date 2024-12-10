import http.server
import socketserver
import urllib.request

Handler = http.server.SimpleHTTPRequestHandler
existing_do_GET = Handler.do_GET

# Digest username="admin", realm="Authentication Login"

def do_GET(self):
        if self.path.startswith('/sqwerl'):
            print("********", self.path)
            self.send_response(200)
            new_path = '%s%s'%('http://localhost:6719', self.path)
            self.end_headers()
            self.copyfile(urllib.request.urlopen(new_path), self.wfile)
        else:
            print("----> ", self.path)
            existing_do_GET(self)

Handler.do_GET = do_GET

socketserver.TCPServer(("", 4444), Handler).serve_forever()
