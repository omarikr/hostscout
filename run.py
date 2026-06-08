import subprocess
import sys
import os

def main():
    os.chdir(r'c:\Users\HP\Downloads\bot\fresh\hostscout')
    
    print("Starting Next.js development server...")
    print("Server will be available at http://localhost:3000")
    print("\nPress Ctrl+C to stop the server\n")
    
    subprocess.run('npm run dev', shell=True)

if __name__ == '__main__':
    main()
