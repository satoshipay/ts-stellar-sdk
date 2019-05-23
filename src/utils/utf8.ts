export function stringToBinary(str: string): ArrayBuffer {
  const array: number[] = [];
  const length = str.length;

  let sourceIndex = 0;
  while (sourceIndex < length) {
    let charCode = str.charCodeAt(sourceIndex++);

    if (charCode < 0x80) {
      array.push(charCode);
    } else if (charCode < 0x800) {
      array.push((charCode >> 6) | 0xc0);
      array.push((charCode & 0x3f) | 0x80);
    } else if (sourceIndex >= length || charCode < 0xd800 || charCode >= 0xe000) {
      array.push((charCode >> 12) | 0xe0);
      array.push(((charCode >> 6) & 0x3f) | 0x80);
      array.push((charCode & 0x3f) | 0x80);
    } else {
      if (charCode >= 0xdc00) {
        throw new Error(`String ${str} has an improper surrogate pair at position ${sourceIndex - 1}`);
      }
      charCode = 0x10000 + (((charCode & 0x3ff) << 10) | (str.charCodeAt(sourceIndex++) & 0x3ff));
      array.push((charCode >> 18) | 0xf0);
      array.push(((charCode >> 12) & 0x3f) | 0x80);
      array.push(((charCode >> 6) & 0x3f) | 0x80);
      array.push((charCode & 0x3f) | 0x80);
    }
  }

  return new Uint8Array(array).buffer;
}

export function binaryToString(arrayBuffer: ArrayBuffer): string {
  const uint8Array = new Uint8Array(arrayBuffer);
  const noOfBytes = uint8Array.length;
  let result = "";
  let i = 0;
  while (i < noOfBytes) {
    const codePoint = uint8Array[i++];

    if ((codePoint & 0x80) === 0) {
      result += String.fromCharCode(codePoint);
    } else if ((codePoint & 0xe0) === 0xc0) {
      if (i >= noOfBytes) {
        break;
      }

      const nextCodePoint = uint8Array[i++];
      const charCode = ((codePoint & 0x1f) << 6) | (nextCodePoint & 0x3f);
      result += String.fromCharCode(charCode);
    } else if ((codePoint & 0xf0) === 0xe0) {
      if (i + 1 >= noOfBytes) {
        break;
      }

      const nextCodePoint1 = uint8Array[i++];
      const nextCodePoint2 = uint8Array[i++];
      const charCode = ((codePoint & 0x0f) << 12) | ((nextCodePoint1 & 0x3f) << 6) | (nextCodePoint2 & 0x3f);
      result += String.fromCharCode(charCode);
    } else {
      if (i + 2 >= noOfBytes) {
        break;
      }

      const nextCodePoint1 = uint8Array[i++];
      const nextCodePoint2 = uint8Array[i++];
      const nextCodePoint3 = uint8Array[i++];
      let charCode =
        ((codePoint & 0x07) << 18) |
        ((nextCodePoint1 & 0x3f) << 12) |
        ((nextCodePoint2 & 0x3f) << 6) |
        (nextCodePoint3 & 0x3f);

      charCode -= 0x10000;
      result += String.fromCharCode((charCode >> 10) + 0xd800, (charCode & 0x3ff) + 0xdc00);
    }
  }

  return result;
}
