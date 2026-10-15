import os
import zipfile

def package_project():
    out_zip = 'public/broerhood36-project.zip'
    os.makedirs('public', exist_ok=True)
    os.makedirs('dist', exist_ok=True)

    exclude_dirs = {'node_modules', 'dist', '.git', '.cache', 'tmp', '__pycache__'}
    exclude_files = {'broerhood36-project.zip', '.DS_Store'}

    count = 0
    total_raw_size = 0
    with zipfile.ZipFile(out_zip, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for root, dirs, files in os.walk('.'):
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            for f in files:
                if f in exclude_files or f.endswith('.log') or f.endswith('.pyc'):
                    continue
                filepath = os.path.join(root, f)
                arcname = os.path.relpath(filepath, '.')
                zf.write(filepath, arcname)
                count += 1
                total_raw_size += os.path.getsize(filepath)

    zip_size = os.path.getsize(out_zip)
    print(f"Created {out_zip}: {count} files, uncompressed: {total_raw_size/1024/1024:.2f} MB, compressed: {zip_size/1024/1024:.2f} MB")

    # Mirror to dist if dist exists
    import shutil
    shutil.copyfile(out_zip, 'dist/broerhood36-project.zip')

    # Verify
    with zipfile.ZipFile(out_zip, 'r') as zf:
        bad = zf.testzip()
        if bad:
            print(f"Corrupt file: {bad}")
            return False
        else:
            print("Zip archive integrity check PASSED!")
            return True

if __name__ == '__main__':
    package_project()
