import subprocess
import sys
import os

def run_command(cmd):
    print(f"Running: {cmd}")
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    print(result.stdout)
    if result.stderr:
        print(f"Error: {result.stderr}")
    return result.returncode == 0

def main():
    os.chdir(r'c:\Users\HP\Downloads\bot\fresh\hostscout')
    
    print("Installing npm dependencies...")
    if not run_command('npm install'):
        print("Failed to install dependencies")
        sys.exit(1)
    
    print("\nDependencies installed successfully!")
    print("\nTo run the development server, use:")
    print("  npm run dev")
    print("\nOr use Python:")
    print("  python run.py")

if __name__ == '__main__':
    main()
