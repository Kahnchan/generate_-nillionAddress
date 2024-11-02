import { useState } from 'react';
import { DirectSecp256k1Wallet } from '@cosmjs/proto-signing';
import { Random } from '@cosmjs/crypto';
import { Buffer } from 'buffer';
import './App.css';

export default function Home() {
    const [count, setCount] = useState(1);
    const [wallets, setWallets] = useState([]);

    const generateWallet = async () => {
        const privateKey = Random.getBytes(32);
        const wallet = await DirectSecp256k1Wallet.fromKey(privateKey, "nillion");
        const [account] = await wallet.getAccounts();

        return {
            address: account.address,
            privateKey: Buffer.from(privateKey).toString('hex'),
        };
    };

    const generateAddresses = async () => {
        try {
            const generatedWallets = [];

            for (let i = 0; i < count; i++) {
                const walletInfo = await generateWallet();
                generatedWallets.push(`${walletInfo.address},${walletInfo.privateKey}`);
            }

            setWallets(generatedWallets);
        } catch (error) {
            console.error("Error:", error);
            alert("生成地址时出错: " + error.message);
        }
    };

    return (
        <div className="container">
            <h1>Nillion 地址批量生成</h1>
            <div>
            <p>输入数量</p>
            </div>
            <input
                type="number"
                className="count-input"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                min="1"
                placeholder="生成数量"
            />
            <button className="generate-button" onClick={generateAddresses}>生成钱包</button>
            <textarea
                className="output-textarea"
                readOnly
                value={wallets.join('\n')}
                rows={20}
            />
            <p>格式：地址,私钥</p>
        </div>
    );
}
