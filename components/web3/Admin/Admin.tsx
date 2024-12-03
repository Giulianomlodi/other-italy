// Admin.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useAdmin } from './useAdmin';

interface AdminProps {
    contractAddress: `0x${string}`;
}

export default function Admin({ contractAddress }: AdminProps) {
    const {
        adminState,
        isPending,
        setActiveMint,
        updateBaseURIs,
        updateMerkleRoots,
        mintTo
    } = useAdmin(contractAddress);

    const [uriState, setUriState] = useState({
        membersBaseURI: '',
        topMembersBaseURI: ''
    });

    const [merkleState, setMerkleState] = useState({
        membersMerkleRoot: '',
        topMembersMerkleRoot: ''
    });

    const [mintToState, setMintToState] = useState({
        address: '',
        isTopMember: false
    });

    const handleURIUpdate = async () => {
        try {
            await updateBaseURIs(uriState.membersBaseURI, uriState.topMembersBaseURI);
        } catch (error) {
            console.error('Failed to update URIs:', error);
        }
    };

    const handleMerkleUpdate = async () => {
        try {
            await updateMerkleRoots(merkleState.membersMerkleRoot, merkleState.topMembersMerkleRoot);
        } catch (error) {
            console.error('Failed to update merkle roots:', error);
        }
    };

    const handleMintTo = async () => {
        try {
            await mintTo(mintToState.address as `0x${string}`, mintToState.isTopMember);
        } catch (error) {
            console.error('Failed to mint:', error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            {/* Minting Status Control */}
            <Card>
                <CardHeader>
                    <CardTitle>Minting Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            checked={adminState.isActiveMint}
                            onCheckedChange={setActiveMint}
                            disabled={isPending}
                        />
                        <Label>Active Minting</Label>
                    </div>
                </CardContent>
            </Card>

            {/* Base URI Management */}
            <Card>
                <CardHeader>
                    <CardTitle>Update Base URIs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Members Base URI</Label>
                        <Input
                            value={uriState.membersBaseURI}
                            onChange={(e) => setUriState(prev => ({
                                ...prev,
                                membersBaseURI: e.target.value
                            }))}
                            placeholder="https://api.example.com/members/"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Top Members Base URI</Label>
                        <Input
                            value={uriState.topMembersBaseURI}
                            onChange={(e) => setUriState(prev => ({
                                ...prev,
                                topMembersBaseURI: e.target.value
                            }))}
                            placeholder="https://api.example.com/top-members/"
                        />
                    </div>
                    <Button
                        onClick={handleURIUpdate}
                        disabled={isPending}
                        className="w-full"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating URIs...
                            </>
                        ) : (
                            'Update URIs'
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Merkle Root Management */}
            <Card>
                <CardHeader>
                    <CardTitle>Update Merkle Roots</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Members Merkle Root</Label>
                        <Input
                            value={merkleState.membersMerkleRoot}
                            onChange={(e) => setMerkleState(prev => ({
                                ...prev,
                                membersMerkleRoot: e.target.value
                            }))}
                            placeholder="0x..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Top Members Merkle Root</Label>
                        <Input
                            value={merkleState.topMembersMerkleRoot}
                            onChange={(e) => setMerkleState(prev => ({
                                ...prev,
                                topMembersMerkleRoot: e.target.value
                            }))}
                            placeholder="0x..."
                        />
                    </div>
                    <Button
                        onClick={handleMerkleUpdate}
                        disabled={isPending}
                        className="w-full"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating Merkle Roots...
                            </>
                        ) : (
                            'Update Merkle Roots'
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Manual Minting */}
            <Card>
                <CardHeader>
                    <CardTitle>Mint To Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Recipient Address</Label>
                        <Input
                            value={mintToState.address}
                            onChange={(e) => setMintToState(prev => ({
                                ...prev,
                                address: e.target.value
                            }))}
                            placeholder="0x..."
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            checked={mintToState.isTopMember}
                            onCheckedChange={(checked) => setMintToState(prev => ({
                                ...prev,
                                isTopMember: checked
                            }))}
                        />
                        <Label>Mint as Top Member</Label>
                    </div>
                    <Button
                        onClick={handleMintTo}
                        disabled={isPending}
                        className="w-full"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Minting...
                            </>
                        ) : (
                            'Mint NFT'
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Current State Display */}
            <Card>
                <CardHeader>
                    <CardTitle>Current Contract State</CardTitle>
                </CardHeader>
                <CardContent>
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                        {JSON.stringify(adminState, null, 2)}
                    </pre>
                </CardContent>
            </Card>
        </div>
    );
}