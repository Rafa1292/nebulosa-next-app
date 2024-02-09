'use client'

import { InputCategory} from '@/interfaces'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { useRouter } from 'next/navigation'
import { createUpdateInputCategory } from '@/actions'

interface Props {
  inputCategory: Partial<InputCategory>
}


interface FormInputs {
  id: string
  name: string
}

export const InputCategoryForm = ({ inputCategory }: Props) => {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { isValid, errors }
  } = useForm<FormInputs>({
    criteriaMode: 'all',
    defaultValues: {
      ...inputCategory
    },
  })


  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData()

    if (inputCategory.id) {
      formData.append('id', inputCategory.id)
    }
    formData.append('name', data.name)

    const { ok, message} = await createUpdateInputCategory(formData)
    if (ok) {
      router.push('/admin/input-categories')
    } else {
      alert(message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='grid  grid-cols-1 w-full px-8 md:px-48'>
      <div className='mt-5'>
        <div className='flex flex-col mb-4'>
          <span className='font-bold antialiased'>Nombre</span>
          <input
            {...register('name', { required: 'El nombre es obligatorio' })}
            type='text'
            className='p-2 border rounded-md bg-gray-100'
          />
          <ErrorMessage
            errors={errors}
            name='name'
            render={({ messages }) =>
              messages &&
              Object.entries(messages).map(([type, message]) => (
                <p className='text-red-900 text-sm font-bold' key={type}>
                  {message}
                </p>
              ))
            }
          />
        </div>
       
        <button type='submit' disabled={!isValid} className='w-full p-2 bg-blue-500 text-white rounded-md'>
          Guardar
        </button>
      </div>
    </form>
  )
}
