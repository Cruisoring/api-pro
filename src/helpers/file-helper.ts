const fs = require('fs');
const path = require('path');

export abstract class FileHelper {
    public static saveText(filePath: string, content: any): string {

        if (typeof content !== 'string') {
            content = JSON.stringify(content, null, 4);
        }

        filePath = path.isAbsolute(filePath) ? filePath : path.resolve(__dirname, `../../samples/${filePath}`);
        fs.writeFileSync(filePath, content, { encoding: 'utf8', flag: 'w'});
        return filePath;
    }
}