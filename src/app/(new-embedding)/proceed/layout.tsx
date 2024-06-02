'use client'
import { AuthProvider } from '@/features/auth-prompt/providers/AuthContext';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react'

const ProceedLayout = ({
	children,
}: {
	children: React.ReactNode;
}) => {



	return (
		<div>
				<UserProvider>
					<AuthProvider>
						{children}
					</AuthProvider>
				</UserProvider>
		</div>
	)
}

export default ProceedLayout