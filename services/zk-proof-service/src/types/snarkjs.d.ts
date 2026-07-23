declare module "snarkjs" {
  const snarkjs: {
    groth16: {
      fullProve(
        input: Record<string, unknown>,
        wasmPath: string,
        zkeyPath: string
      ): Promise<{ proof: Record<string, unknown>; publicSignals: string[] }>;
      verify(
        vKey: Record<string, unknown>,
        publicSignals: string[],
        proof: Record<string, unknown>
      ): Promise<boolean>;
    };
  };
  export default snarkjs;
  export = snarkjs;
}
