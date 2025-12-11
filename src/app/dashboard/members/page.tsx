import MembersScreen from "@/features/Members/presentation/screens/MembersScreen"

export default function MembersPage({ params }: { params: { organizationId: string } }) {
    return <MembersScreen params={params} />
}
