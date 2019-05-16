export function convertStringToUtf8(source: string): ArrayBuffer {
  const length = source.length;
  const resultArray = [];

  let sourceIndex = 0;
  while (sourceIndex < length) {
    let charCode = source.charCodeAt(sourceIndex++);

    if (charCode < 0x80) {
      resultArray.push(charCode);
    } else if (charCode < 0x800) {
      resultArray.push((charCode >> 6) | 0xc0);
      resultArray.push((charCode & 0x3f) | 0x80);
    } else if (sourceIndex >= length || charCode < 0xd800 || charCode >= 0xe000) {
      resultArray.push((charCode >> 12) | 0xe0);
      resultArray.push(((charCode >> 6) & 0x3f) | 0x80);
      resultArray.push((charCode & 0x3f) | 0x80);
    } else {
      charCode = 0x10000 + (((charCode & 0x3ff) << 10) | (source.charCodeAt(sourceIndex++) & 0x3ff));
      resultArray.push((charCode >> 18) | 0xf0);
      resultArray.push(((charCode >> 12) & 0x3f) | 0x80);
      resultArray.push(((charCode >> 6) & 0x3f) | 0x80);
      resultArray.push((charCode & 0x3f) | 0x80);
    }
  }

  return new Uint8Array(resultArray).buffer;
}
