import React from 'react'

const NPromptLayout = ({
	children,
}: {
	children: React.ReactNode;
}) => {
  return (
    <div className='max-w-screen-md h-64 mx-auto'>
          {children}
    </div>
  )
}

export default NPromptLayout