import React, { Suspense } from 'react'

const NPromptLayout = ({
	children,
}: {
	children: React.ReactNode;
}) => {
  return (
    <div className='max-w-screen-md h-64 mx-auto'>
      <Suspense>
          {children}
      </Suspense>
    </div>
  )
}

export default NPromptLayout