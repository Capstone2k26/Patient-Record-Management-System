"""
PRMS Database Initialization Script
Seeds local storage / MongoDB with standard clinical demo users, medical records, and biomarker metrics.
"""
import subprocess
import sys
import os

if __name__ == '__main__':
    current_dir = os.path.dirname(os.path.abspath(__file__))
    init_data_path = os.path.join(current_dir, 'init_data.py')
    print("Executing PRMS database initialization...")
    exec(open(init_data_path).read())
