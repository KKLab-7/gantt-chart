<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class CreateRepository extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:repository {repositoryClassName}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new repository class';

    /**
     * @const string service dir path
     */
    public const SERVICES_PATH = 'app/Repository/';

    /**
     * @var string
     */
    private $directoryPath = "";

    /**
     * @var string
     */
    private $namespace;

    /**
     * @var string
     */
    private $className;

    /**
     * @var string
     */
    private $repositoryFileName;

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->setParameter();

        if (!$this->className) {
            $this->error('Repository Class Name invalid');

            return;
        }

        if (!$this->isExistsDirectory()) {
            $this->createDirectory();
        }

        if ($this->isExistFiles()) {
            $this->error('Repository already exist');

            return;
        }

        $this->createRepositoryClass();
        $this->info('Repository created successfully');
    }

    /**
     * Create repository class
     *
     * @return void
     */
    public function createRepositoryClass(): void
    {
        $content = <<<EOD
        <?php

        namespace App\Repository{$this->namespace};

        class {$this->className}
        {
            public function __construct()
            {

            }
        }
        EOD;

        file_put_contents($this->repositoryFileName, $content);
    }

    /**
     * To check if a repository file with the same name exists.
     *
     * @return bool
     */
    private function isExistFiles(): bool
    {
        return file_exists($this->repositoryFileName);
    }

    /**
     * To check if a repository directory with the same name exists.
     *
     * @return boolean
     */
    private function isExistsDirectory(): bool
    {
        return file_exists(self::SERVICES_PATH . $this->directoryPath);
    }

    /**
     * Create repository directory
     *
     * @return void
     */
    private function createDirectory(): void
    {
        mkdir(self::SERVICES_PATH . $this->directoryPath, 0755, true);
    }

    private function setParameter() {
        $repositoryClassName = $this->argument('repositoryClassName');
        if (Str::contains($repositoryClassName, '/')) {
            $this->directoryPath = Str::beforeLast($repositoryClassName, '/');
            $this->namespace = '\\' . str_replace('/', '\\', $this->directoryPath);
            $this->className = Str::afterLast($repositoryClassName, '/');
            $this->repositoryFileName = self::SERVICES_PATH . $repositoryClassName . '.php';
        } else {
            $this->className = $this->argument('repositoryClassName');
            $this->repositoryFileName = self::SERVICES_PATH . $repositoryClassName . '.php';
        }
    }
}
