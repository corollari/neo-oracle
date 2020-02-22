using Neo.SmartContract.Framework.Services.Neo;
using System.Numerics;

namespace Neo.SmartContract
{
    public class HelloWorld : Framework.SmartContract
    {
        private static readonly byte[] Oracle = {0x5d, 0xf3, 0x1f, 0x6f, 0x59, 0xe6, 0xa4, 0xfb, 0xdd, 0x75, 0x10, 0x37, 0x86, 0xbf, 0x73, 0xdb, 0x10, 0x00, 0xb2, 0x35};

        public static void Main(string operation, params object[] args)
        {
            if (Runtime.Trigger == TriggerType.Application)
            {
                if (operation=="updatePrice")
                {
                    if (Runtime.CheckWitness(Oracle)){
                        BigInteger price = (BigInteger)args[0];
                        Storage.Put("price", price);
                    }
                }
            }
        }
    }
}
