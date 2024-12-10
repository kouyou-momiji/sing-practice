import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,      // 监听所有地址，包括 LAN 和公网地址
    port: 5173,      // 指定端口号
    strictPort: true, // 如果端口被占用，则中止
    proxy: {
      '/api': {
        target: 'http://ckapi.sevenbrothers.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // 确保所有响应头都被暴露
            const headers = proxyRes.headers;
            if (headers.location) {
              res.setHeader('Access-Control-Expose-Headers', '*');
              // 直接设置location头
              res.setHeader('Location', headers.location);
            }
          });
        }
      }
    }
  }
})