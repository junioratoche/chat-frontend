// export const getPayloadSize = (value: string): number => {
// 	return Buffer.from(value).length
// }

export const getPayloadSize = (value: string): number => {
    return new TextEncoder().encode(value).length
}

