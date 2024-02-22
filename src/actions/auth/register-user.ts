'use server'

import prisma from "@/lib/prisma"
import bcryptjs from 'bcryptjs'

export const registerUser = async (name: string, email: string, password: string) => {

    try {

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: bcryptjs.hashSync(password )
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        })

        return {
            ok: true,
            message: 'Usuario registrado correctamente',
            user
        }
        
    } catch (error) {
        return {
            ok: false,
            message: 'No se pudo registrar el usuario'
        }
    }
}
