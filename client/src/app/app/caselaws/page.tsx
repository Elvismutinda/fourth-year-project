import SearchCase from '@/components/SearchCase'
import { Card, CardContent } from '@/components/ui/card'

const page = () => {
  return (
    <div className="flex justify-center items-center w-full h-full p-16">
      <Card className="w-full h-full shadow-lg border border-gray-700">
        <CardContent className="h-full overflow-y-auto m-1">
          <SearchCase />
        </CardContent>
      </Card>
    </div>
  )
}

export default page