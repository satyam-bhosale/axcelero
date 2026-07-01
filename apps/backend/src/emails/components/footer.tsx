import { Container, Text } from 'react-email'

export function AxceleroFooter() {
  const year = new Date().getFullYear()
  return (
    <>
      <Container className='text-center'>
        <Text className='text-xs text-neutral-600'>
          {`© ${year} Axcelero. All rights reserved.`}<br/>
          100 Montgomery Street, Suite 800, San Francisco, CA 94104
        </Text>
      </Container>
    </>
  )
}