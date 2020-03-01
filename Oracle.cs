using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Services.Neo;
using System.Numerics;

namespace Neo.SmartContract
{
    public class HelloWorld : Framework.SmartContract
    {
        private static readonly byte[] Oracle = "ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s".ToScriptHash();
        
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
