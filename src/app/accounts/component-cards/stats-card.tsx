import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface StatsCardProps {
    title: string
    value: number
    icon: React.ReactNode
}

export default function StatsCard({ title, value, icon }: StatsCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    )
}