'use client'

import { createUpdateAddress, createUpdateCustomer, getCustomerById, getCustomerByPhone } from '@/actions'
import { Address, Customer } from '@/interfaces'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { IoIosSave } from 'react-icons/io'
import { IoAddCircleOutline } from 'react-icons/io5'
import { MdCancel } from 'react-icons/md'
import { useBillStore } from '@/store'

export const BillClient = () => {
  const { setAddressId, bill, setCustomerId } = useBillStore()
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [addDirection, setAddDirection] = useState(false)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [description, setDescription] = useState('')
  const [addresses, setAddresses] = useState<Address[]>([])

  const phoneIsValid = () => {
    if (phone.toString().length > 7) {
      return true
    } else {
      return false
    }
  }

  const getCurrentCustomerByPhone = async (phone: string) => {
    setPhone(phone)
    if (phone.length > 7) {
      const { customer: currentCustomer } = await getCustomerByPhone(phone)
      if (currentCustomer) {
        setCustomerId(currentCustomer.id)
        setCustomer(currentCustomer)
        setName(currentCustomer.name)
        setAddresses(currentCustomer.addresses)
      }
    } else {
      setName('')
      setCustomer(null)
    }
  }

  const newCustomerIsValid = () => {
    if (phoneIsValid() && name.length > 2) {
      return true
    } else {
      return false
    }
  }

  const saveAddress = async () => {
    if (description.length > 2) {
      const { ok, message } = await createUpdateAddress({
        id: '',
        customerId: customer?.id || '',
        description: description,
      })
      if (ok) {
        getCurrentCustomerByPhone(phone)
        setDescription('')
        setAddDirection(false)
      } else {
        alert(message)
      }
    }
  }

  const saveCustomer = async () => {
    if (newCustomerIsValid()) {
      const {
        ok,
        message,
        customer: currentCustomer,
      } = await createUpdateCustomer({
        id: customer?.id || '',
        phone: phone,
        name: name,
        email: customer?.email || '',
        creditLimit: customer?.creditLimit || 0,
        creditState: customer?.creditState || false,
        idNumber: customer?.idNumber || '',
      })
      if (ok && currentCustomer) {
        setCustomer(currentCustomer)
        setName(currentCustomer.name)
      } else {
        alert(message)
      }
    }
  }

  const initializeComponent = async () => {
    const { customer: currentCustomer } = await getCustomerById(bill.clientId)
    if (currentCustomer) {
      setCustomer(currentCustomer)
      setName(currentCustomer.name)
      setPhone(currentCustomer.phone)
      setAddresses(currentCustomer.addresses)
    } else {
      setCustomer(null)
      setName('')
      setPhone('')
    }
  }

  useEffect(() => {
    initializeComponent()
  }, [bill.clientId])

  return (
    <div className='w-full flex flex-wrap items-center gap-2 px-1 justify-left h-[6vh]'>
      <input
        onChange={(ev) => setName(ev.target.value)}
        disabled={!phoneIsValid()}
        value={name}
        placeholder='Cliente'
        type='text'
        className='text-black p-2 text-xs border w-1/4 rounded-md bg-gray-100'
      />
      {customer && customer?.name !== name && customer?.id !== '' && (
        <FaCheckCircle
          onClick={() => saveCustomer()}
          size={20}
          className='text-green-700 cursor-pointer hover:!text-green-900'
        />
      )}

      <input
        onChange={(ev) => getCurrentCustomerByPhone(ev.target.value)}
        value={phone}
        placeholder='Telefono'
        type='number'
        className='p-2 text-xs border w-1/4 rounded-md bg-gray-100'
      />
      {customer !== null ? (
        <>
          {!addDirection && addresses.length > 0 ? (
            <>
              <select
                onChange={(ev) => setAddressId(ev.target.value)}
                disabled={!phoneIsValid()}
                className='p-2 text-gray-500 text-xs w-1/3 border rounded-md bg-gray-100'
              >
                <option value=''>Direccion</option>
                {addresses.map((address) => (
                  <option selected={address.id === bill?.addressId} key={address.id} value={address.id}>
                    {address.description}
                  </option>
                ))}
              </select>
              {phoneIsValid() && (
                <IoAddCircleOutline
                  size={30}
                  onClick={() => setAddDirection(!addDirection)}
                  className='hover:bg-black hover:text-white rounded-full  text-black cursor-pointer'
                />
              )}
            </>
          ) : (
            <>
              <input
                onChange={(ev) => setDescription(ev.target.value)}
                placeholder='Direccion'
                type='text'
                className='text-black p-2 text-xs border w-1/4 rounded-md bg-gray-100'
              />
              {phoneIsValid() && (
                <>
                  <IoIosSave
                    size={25}
                    onClick={() => saveAddress()}
                    className='hover:bg-black hover:text-white rounded text-black cursor-pointer'
                  />
                  <MdCancel
                    size={25}
                    onClick={() => setAddDirection(false)}
                    className='hover:bg-red-800 hover:!text-white rounded-full text-red-800 cursor-pointer'
                  />
                </>
              )}
            </>
          )}
        </>
      ) : (
        <button
          onClick={() => saveCustomer()}
          className={clsx(
            'bg-green-600 p-2 text-white text-xs border w-1/4 rounded-md hover:bg-green-700 cursor-pointer',
            {
              'hover:bg-gray-400 !bg-gray-400 !cursor-not-allowed': newCustomerIsValid() === false,
            }
          )}
        >
          Crear cliente
        </button>
      )}
    </div>
  )
}
