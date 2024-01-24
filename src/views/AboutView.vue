<template>
  <div class="flex flex-col items-start justify-start mx-8 md:mx-64 mt-4">
    <p class="text-xl md:text-2xl">About the project</p>
    <p>Decentralized timestamping is a process of reliably storing the creation or modification time of a file on multiple nodes without a centralized authority. In contrast to TSA (Time Stamping Authorities) there is no need to have faith in a proper infrastructure deployment of a centralized authority, but rather in the protocol implementation itself (trustless decentralized application).</p>
    <p>This dApp is open source and the smart contract runs on the <font-awesome-icon icon="fa-brands fa-ethereum" /> Ethereum blockchain.</p>
    <p>Your file goes through the timestamping process, once you upload it:</p>
    <ol class="list-decimal ml-8">
      <li>A SHA-256 digest of your file is created (this is done on the client side - the contents of your file are not shared with anyone<sup>1</sup>).</li>
      <li>The digest is searched for on the blockchain to see, whether the file has been timestamped before.</li>
      <li>You can store the checksum of the file in a smart contract on the Ethereum blockchain.</li>
    </ol>

    <p class="text-xl md:text-2xl mt-4">Frequently Asked Questions</p>
    <p class="text-lg mt-2">Why is the transaction cost so high?</p>
    <p>The transaction cost is high due to the Ethereum network congestion and due to the fact that you are storing data permanently on the Ethereum blockchain.</p>
    <p>Ethereum scaling<sup>2</sup> might be explored in the future.</p>
    <p class="text-lg mt-2">What is the use case for decentralized timestamping?</p>
    <p>In particular this dApp was created so I could create a checksum of my logo and other information, which I cannot disclose publicly, but I might need to prove in the future that it existed in this point in time.</p>
    <p>Publishing a timestamp of a company logo or other resources might be described as defensive publication<sup>3</sup>, but I cannot ensure that this qualifies as such, as I am not a lawyer.</p>
    <p>But what I think is more important is that anyone can interpret the existance of this timestamp on their own - the only thing this dApp hopefully proves is that a file existed in a certain point in time and who had access to it.</p>
    <p class="text-lg mt-2">How can I contribute?</p>
    <p>You can open an issue or a pull request in the repository, which you are trying to contribute to.</p>
    <p>Any new suggestions, features or bug reports are more than welcome.</p>

    <div class="flex py-2 items-center w-full">
      <div class="flex-grow border-t border-gray-400"></div>
      <span class="flex-shrink mx-4 text-gray-400">Footnotes</span>
      <div class="flex-grow border-t border-gray-400"></div>
    </div>
    <ol class="list-decimal ml-8">
      <li>File content may be revealed, if it can be bruteforced. This is not likely, when using svg or png files you have created or txt files of sufficient length you have created. An example of a file, where the content can be revealed is a txt file with the content "Hello world!" or a png picture you have found on the internet. A method for protecting against such bruteforce attacks is to append random data at the end of the user-provided file. The user has to then store the random data alongside the file to be able to prove that he timestamped the file in the past.</li>
      <li><a href="https://ethereum.org/developers/docs/scaling" class="text-blue-500 hover:underline" target="_blank">Ethereum documentation on scaling</a></li>
      <li><a href="https://en.wikipedia.org/wiki/Defensive_publication" class="text-blue-500 hover:underline" target="_blank">Wikipedia article on Defensive publication</a></li>
    </ol>
  </div>
</template>

<style></style>
